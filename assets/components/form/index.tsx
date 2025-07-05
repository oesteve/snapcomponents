import React, { useContext, useEffect, useState } from "react";
import { type StoreApi, createStore, useStore } from "zustand";
import { shallow } from "zustand/shallow";
import { useStoreWithEqualityFn } from "zustand/traditional";

import { type ErrorInterface } from "@/lib/error";
import { type FieldError, VALIDATION_ERROR_TYPE } from "@/lib/error/validation";
import { cn } from "@/lib/utils";
import { getNestedObjectValue as getKeyValue } from "@/lib/utils/get-nested-object-value";
import { setNestedObjectValue } from "@/lib/utils/set-object-value";

const formContext = React.createContext<StoreApi<FormState> | null>(null);
const FormProvider = formContext.Provider;

export interface FormElementProps {
    name: string;
    defaultValue?: any;
    label?: string;
    labelAction?: React.ReactNode;
    required?: boolean;
    loading?: boolean;
    disabled?: boolean;
    onChange?: (value: any) => void;
    description?: string;
    className?: string;
}

interface FormProps<T> {
    defaultData?: Partial<T>;
    className?: string;
    store?: StoreApi<FormState>;
    children: React.ReactNode;
    onSubmit: ((data: T) => void) | ((data: T) => Promise<void>);
    error?: ErrorInterface | null;
    ref?: React.RefObject<HTMLFormElement>;
    name?: string;
    id?: HTMLFormElement["id"];
    choices?: Record<string, Record<string, any>>;
}

type Subscription = (
    fieldName: string,
    callback: (data: any) => void,
    debouncing?: number,
) => () => void;

export interface FormState {
    defaultData: Record<string, any>;
    data: Record<string, any>;
    error: ErrorInterface | null;
    loading: boolean;
    fieldErrors: FieldError[];
    setError: (error: ErrorInterface | null) => void;
    setFieldValue: (
        name: string,
        value: any,
        options?: { undefinedOnNullish: boolean },
    ) => void;
    reset: (data?: FormState["defaultData"]) => void;
    setData: (data: any) => void;
    setChoices: (choices: Record<string, Record<string, any>>) => void;
    choices?: Record<string, Record<string, any>>;
    subscribers: Record<string, Set<(value: any) => void>>;
    subscribe: Subscription;
}

type InitialState = Pick<
    FormState,
    "error" | "defaultData" | "data" | "fieldErrors"
>;

export function createFormStore(
    initialState?: Partial<InitialState>,
): StoreApi<FormState> {
    return createStore<FormState>(
        (set, getState) => ({
            error: initialState?.error ?? null,
            defaultData: initialState?.defaultData ?? {},
            data: initialState?.defaultData ?? {},
            loading: false,
            fieldErrors: [],
            setFieldValue: (key, value, options) => {
                if (options?.undefinedOnNullish && !value) {
                    value = undefined;
                }

                set((state) => {
                    // Update the field value in state
                    const updatedState = {
                        fieldErrors: state.fieldErrors.filter(
                            (fieldError) => fieldError.field !== key,
                        ),
                        error: null,
                        data: setNestedObjectValue(state.data, key, value),
                    };

                    Object.entries(state.subscribers).forEach(
                        ([choiceKey, subscribers]) => {
                            if (!key.startsWith(choiceKey)) {
                                return;
                            }
                            subscribers.forEach((callback) => {
                                callback(value); // Calls the debounced or direct callback
                            });
                        },
                    );

                    return updatedState;
                });
            },
            setError: (error: ErrorInterface | null) => {
                set({ error });
                if (error?.type === VALIDATION_ERROR_TYPE) {
                    set({ fieldErrors: error.fields as FieldError[] });
                }
            },
            reset: (data) => {
                console.log("reset", data);

                const defaultData = data ?? getState().defaultData;
                set({
                    defaultData: {
                        ...defaultData,
                        __version: Math.random(),
                    },
                    data: defaultData,
                });
            },
            setData: (data) => {
                set({
                    defaultData: data,
                    ...data,
                });
            },
            setChoices: (choices) => {
                set({ choices: choices });
            },
            subscribers: {},
            subscribe: (
                fieldName: string,
                callback: (data: any) => void,
                debouncing?: number,
            ) => {
                const store = getState();

                // Ensure the field has a subscriber set
                if (!store.subscribers[fieldName]) {
                    store.subscribers[fieldName] = new Set();
                }

                // If a debouncing delay is provided, wrap the callback with a debouncing function
                const callbackFn = debouncing
                    ? (() => {
                          let timer: NodeJS.Timeout | null = null;

                          return (value: any) => {
                              if (timer) clearTimeout(timer);
                              timer = setTimeout(() => {
                                  callback(value);
                              }, debouncing);
                          };
                      })()
                    : callback; // If no debouncing, use the callback directly

                // Add the debounced callback to the subscriber set
                store.subscribers[fieldName].add(callbackFn);

                // Return an unsubscribe function
                return () => {
                    store.subscribers[fieldName].delete(callbackFn);
                    if (store.subscribers[fieldName].size === 0) {
                        delete store.subscribers[fieldName];
                    }
                };
            },
        }),
        // shallow,
    );
}

function useFormStore() {
    const formStore = useContext(formContext);

    if (!formStore) {
        throw new Error("useFormLoading must be used within a FormProvider");
    }
    return formStore;
}

export const useGetFormData = () => {
    const formStore = useFormStore();

    return () => {
        const { data } = formStore.getState();
        return data;
    };
};

export const useFieldValue = (fieldName: string, debounce: number = 1000) => {
    const formStore = useFormStore();
    const [value, setValue] = useState(
        getKeyValue(formStore.getState().data, fieldName),
    );

    useEffect(() => {
        return formStore.getState().subscribe(
            fieldName,
            (value) => {
                setValue(value);
            },
            debounce,
        );
    }, [fieldName, debounce, formStore]);

    return value;
};

export const useFormLoading = () => {
    const formStore = useFormStore();

    return useStoreWithEqualityFn(formStore, (state) => state.loading, shallow);
};

export const useFormError = () => {
    const formStore = useContext(formContext);

    if (!formStore) {
        throw new Error("useFormError must be used within a FormProvider");
    }

    return useStore(formStore, (state) => state.error);
};

export const useSetFieldValue = () => {
    const formStore = useContext(formContext);

    if (!formStore) {
        throw new Error("useFormError must be used within a FormProvider");
    }

    return useStoreWithEqualityFn(
        formStore,
        (state) => state.setFieldValue,
        shallow,
    );
};

export const useGetFieldValue = () => {
    const formStore = useContext(formContext);

    if (!formStore) {
        throw new Error("useFormError must be used within a FormProvider");
    }

    return (key: string) => {
        return getKeyValue(formStore.getState().data, key);
    };
};

export const useFieldErrors = (field: string): string[] => {
    const formStore = useContext(formContext);

    if (!formStore) {
        throw new Error("useFormError must be used within a FormProvider");
    }

    const fieldErrors = useStoreWithEqualityFn(
        formStore,
        (state) => state.fieldErrors,
        shallow,
    );
    return fieldErrors
        .filter((fieldError) => fieldError.field === field)
        .map((fieldError) => fieldError.message);
};

export function useFormData(): Record<string, unknown> {
    const formStore = useContext(formContext);

    if (!formStore) {
        throw new Error("useFormError must be used within a FormProvider");
    }

    return useStore(formStore, (state) => state.data);
}

export function useDefaultData(): Record<string, unknown> {
    const formStore = useContext(formContext);

    if (!formStore) {
        throw new Error("useFormError must be used within a FormProvider");
    }

    return useStoreWithEqualityFn(
        formStore,
        (state) => state.defaultData,
        shallow,
    );
}

export function useFieldData<T>(key: string): T {
    const data = useFormData();
    return getKeyValue(data, key);
}

export function useDefaultFieldData<T>(key: string): any {
    const data = useDefaultData();

    return getKeyValue(data, key) as T;
}

export function useOnDefaultDataChange(
    key: string,
    callback: (data: any) => void,
) {
    const defaultData = useDefaultData();

    callback(getKeyValue(defaultData, key));
}

export function useFieldChoices(key: string): Record<string, any> | undefined {
    const formStore = useContext(formContext);
    if (!formStore) {
        throw new Error("useFormError must be used within a FormProvider");
    }

    return useStore(formStore, (state) => state.choices?.[key]);
}

interface FormBodyInterface {
    children: React.ReactNode;
}

export function FormBody({ children }: FormBodyInterface) {
    return <div className="flex flex-col gap-6">{children}</div>;
}

export function Form<T>(props: FormProps<T>) {
    const [formStore, setFormStore] = useState(
        createFormStore({
            data: props.defaultData ?? {},
            defaultData: props.defaultData ?? {},
        }),
    );

    useEffect(() => {
        if (props.store) {
            setFormStore(props.store);
        }
    }, [props.store]);

    useEffect(() => {
        formStore.getState().setError(props.error ?? null);
    }, [formStore, props.error]);

    useEffect(() => {
        formStore.getState().setChoices(props.choices ?? {});
    }, [formStore, props.choices]);

    useEffect(() => {
        formStore.setState({
            defaultData: props.defaultData ?? {},
            data: props.defaultData ?? {},
        });
    }, [formStore, props.defaultData]);

    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const { data, setError } = formStore.getState();
        const rs = props.onSubmit(data as T);

        if (rs instanceof Promise) {
            formStore.setState({
                loading: true,
                error: null,
            });
            rs.catch((error) => {
                console.error("error", error);
                setError(error);
            }).finally(() => {
                console.log("finally");
                formStore.setState({ loading: false });
            });
        }
    }

    return (
        <form
            className={cn("flex flex-col gap-4", props.className)}
            onSubmit={handleSubmit}
            id={props.id}
        >
            <FormProvider value={formStore}>{props.children}</FormProvider>
        </form>
    );
}
