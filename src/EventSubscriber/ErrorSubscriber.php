<?php

namespace App\EventSubscriber;

use Doctrine\DBAL\Exception\ForeignKeyConstraintViolationException;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpKernel\Event\ExceptionEvent;

class ErrorSubscriber implements EventSubscriberInterface
{
    public function __construct(
        #[Autowire('%kernel.environment%')]
        private string $appEnv,
    ) {
    }

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

        $throwable = $event->getThrowable();

        $data = [
            'message' => $this->getMessage($throwable),
        ];

        if ('prod' !== $this->appEnv) {
            $data['trace'] = $throwable->getTrace();
        }

        $event->setResponse(
            new JsonResponse(
                $data,
                JsonResponse::HTTP_INTERNAL_SERVER_ERROR
            )
        );
    }

    public static function getSubscribedEvents(): array
    {
        return [
            ExceptionEvent::class => ['onExceptionEvent', -1],
        ];
    }

    private function getMessage(\Throwable $throwable): string
    {
        if ('prod' !== $this->appEnv) {
            return $throwable->getMessage();
        }

        return match (true) {
            $throwable instanceof ForeignKeyConstraintViolationException => 'Error with a relation when saving data',
            default => $throwable->getMessage(),
        };
    }
}
