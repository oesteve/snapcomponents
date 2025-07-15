<?php

namespace App\Service\Articles;

use App\Entity\Article;
use App\Service\Search\Embedder;
use Twig\Environment;

readonly class ArticleEmbedder
{
    public function __construct(
        private Embedder $embedder,
        private Environment $twig,
    ) {
    }

    /**
     * @return array<float>
     */
    public function createEmbeddings(Article $article): array
    {
        // Generate markdown representation of the article using Twig
        $text = $this->twig->render('article/embedding.md.twig', [
            'article' => $article,
        ]);

        return $this->embedder->createEmbeddings($text);
    }
}
