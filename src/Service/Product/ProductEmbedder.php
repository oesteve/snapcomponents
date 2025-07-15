<?php

namespace App\Service\Product;

use App\Service\Search\Embedder;
use Twig\Environment;

readonly class ProductEmbedder
{
    public function __construct(
        private Embedder $embedder,
        private Environment $twig,
    ) {
    }

    /**
     * @return array<float>
     */
    public function createEmbeddings(ProductInterface $product): array
    {
        // Generate markdown representation of the product using Twig
        $text = $this->twig->render('product/embedding.md.twig', [
            'product' => $product,
        ]);

        return $this->embedder->createEmbeddings($text);
    }
}
