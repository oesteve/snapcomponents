<?php

namespace App\Service\Product;

use App\Entity\Agent;

interface ProductProviderBuilder
{
    /**
     * @param array<string, mixed> $settings
     */
    public function build(Agent $agent, ?array $settings): ProductProvider;

    public static function getProviderName(): string;
}
