<?php

namespace App\Service\Product;

use App\Entity\Agent;

interface ProductProviderBuilder
{
    public function build(Agent $agent): ProductProvider;

    public static function getProviderName(): string;
}
