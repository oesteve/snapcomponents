<?php

namespace App\Service\Product;

use App\Entity\Agent;

interface ProductProviderFactory
{
    public function forAgent(Agent $agent): ProductProvider;
}
