<?php

namespace App\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;
use Symfony\Component\HttpKernel\Exception\UnprocessableEntityHttpException;
use Symfony\Component\Validator\ConstraintViolation;
use Symfony\Component\Validator\Exception\ValidationFailedException;

class ValidationErrorSubscriber implements EventSubscriberInterface
{
    public function onExceptionEvent(ExceptionEvent $event): void
    {
        // Get the current request from the event
        $request = $event->getRequest();

        // Check if the Request 'Content-Type' is 'application/json' (strictly for POST, PUT, etc.)
        if (!('application/json' === $request->headers->get('Content-Type')
            || 'json' === $request->getRequestFormat())
        ) {
            return;
        }

        $exception = $event->getThrowable();
        if (!($exception instanceof UnprocessableEntityHttpException)) {
            return;
        }

        // Only validation error shoudl be handled

        $previousException = $exception->getPrevious();
        if (!($previousException instanceof ValidationFailedException)) {
            return;
        }

        /** @var ConstraintViolation[] $violations */
        $violations = iterator_to_array($previousException->getViolations());

        /** @var array<string, mixed> $fields */
        $fields = array_map(
            function (ConstraintViolation $constraintViolation) {
                $field = preg_replace_callback(
                    '/\[([^\]]+)\]/',
                    static function (array $matches) {
                        return is_numeric($matches[1]) ? '['.$matches[1].']' : '.'.$matches[1];
                    },
                    $constraintViolation->getPropertyPath()
                );

                return [
                    'field' => $field,
                    'message' => $constraintViolation->getMessage(),
                ];
            },
            $violations
        );

        $event->setResponse(
            new JsonResponse(
                [
                    'message' => 'Validation error',
                    'type' => 'validationError',
                    'fields' => $fields,
                ],
                JsonResponse::HTTP_BAD_REQUEST
            )
        );
    }

    public static function getSubscribedEvents(): array
    {
        return [
            ExceptionEvent::class => 'onExceptionEvent',
        ];
    }
}
