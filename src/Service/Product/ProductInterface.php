<?php

namespace App\Service\Product;

use App\Serializer\SerializerGroups;
use Symfony\Component\Serializer\Attribute\Groups;

interface ProductInterface
{
    #[Groups([SerializerGroups::API_LIST])]
    public function getName(): string;

    #[Groups([SerializerGroups::API_LIST])]
    public function getTitle(): ?string;

    #[Groups([SerializerGroups::API_LIST])]
    public function getDescription(): ?string;

    #[Groups([SerializerGroups::API_LIST])]
    public function getPrice(): float;

    #[Groups([SerializerGroups::API_LIST])]
    public function getImage(): string;
}
