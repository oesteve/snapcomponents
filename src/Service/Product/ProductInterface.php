<?php

namespace App\Service\Product;

use App\Serializer\SerializerGroups;
use Symfony\Component\Serializer\Attribute\Groups;

interface ProductInterface
{
    #[Groups([SerializerGroups::API_LIST])]
    public function getId(): int;

    #[Groups([SerializerGroups::API_LIST])]
    public function getReferenceCode(): ?string;

    #[Groups([SerializerGroups::API_LIST])]
    public function getTitle(): string;

    #[Groups([SerializerGroups::API_LIST])]
    public function getSKU(): ?string;

    #[Groups([SerializerGroups::API_LIST])]
    public function getBrand(): ?string;

    #[Groups([SerializerGroups::API_LIST])]
    public function getDescription(): ?string;

    #[Groups([SerializerGroups::API_LIST])]
    public function getPrice(): float;

    #[Groups([SerializerGroups::API_LIST])]
    public function getImage(): string;
}
