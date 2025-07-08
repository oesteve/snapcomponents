<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

abstract class BaseTestCase extends KernelTestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();
    }

    /**
     * @template T of object
     *
     * @param class-string<T> $class
     *
     * @return T
     *
     * @throws \LogicException
     */
    protected function getService(string $class): mixed
    {
        /** @var T|null $service */
        $service = static::getContainer()->get($class);

        if (null === $service) {
            throw new \LogicException(sprintf('Service "%s" not found in container', $class));
        }

        return $service;
    }
}
