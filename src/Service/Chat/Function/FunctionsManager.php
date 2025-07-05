<?php

namespace App\Service\Chat\Function;

use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;

class FunctionsManager
{

    /**
     * @var array<int, FunctionInterface>
     */
    public array $functions = [];

    /**
     * @param iterable<FunctionInterface> $functions
     */
    public function __construct(
        #[AutowireIterator(tag: 'app.chat.function')]
        iterable                               $functions,
    )
    {
        foreach ($functions as $function) {
            $this->functions[$function->getName()] = $function;
        }
    }


    /**
     * @return array<FunctionInterface>
     */
    public function getFunctions(): array
    {
        return array_values($this->functions);
    }
}
