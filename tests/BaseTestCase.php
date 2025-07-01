<?php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\HttpKernel\KernelInterface;

abstract class BaseTestCase extends KernelTestCase
{

    protected function setUp(): void
    {
        parent::setUp();
        self::bootKernel();
    }


    /**
     * @template T
     * @param class-string<T> $class
     * @return T
     * @throws \LogicException
     */
    protected function getService(string $class): mixed
    {
        $service = static::getContainer()->get($class);

        if (!$service) {
            throw new \LogicException(sprintf('Service "%s" not found in container', $class));
        }

        return $service;
    }
}
