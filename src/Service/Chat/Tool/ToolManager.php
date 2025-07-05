<?php

namespace App\Service\Chat\Tool;

use Symfony\Component\DependencyInjection\Attribute\AutowireIterator;

class ToolManager
{
    const string CHAT_SCOPE = 'CHAT';

    /**
     * @var array<string, ToolInterface>
     */
    public array $functions = [];

    /**
     * @param iterable<ToolInterface> $tools
     */
    public function __construct(
        #[AutowireIterator(tag: 'app.chat.tool')]
        iterable $tools,
    )
    {
        foreach ($tools as $function) {
            $this->functions[$function->getName()] = $function;
        }
    }

    /**
     * @return array<ToolInterface>
     */
    public function getTools(?string $scope = null): array
    {

        return array_reduce(
            $this->functions,
            function (array $carry, ToolInterface $item) use ($scope) {
                if($scope && !$item->support($scope)){
                    return $carry;
                }

                $carry[] = $item;

                return $carry;
            }
        , []);
    }
}
