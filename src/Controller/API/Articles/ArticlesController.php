<?php

namespace App\Controller\API\Articles;

use App\Controller\AbstractController;
use App\Controller\API\Articles\DTO\ArticleData;
use App\Entity\Article;
use App\Repository\ArticleRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/articles', format: 'json')]
class ArticlesController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(
        ArticleRepository $articleRepository,
    ): JsonResponse
    {
        return $this->json($articleRepository->findAll());
    }

    #[Route('', methods: ['POST'])]
    public function create(
        #[MapRequestPayload]
        ArticleData       $articleData,
        ArticleRepository $articleRepository,
    ): JsonResponse
    {
        $article = new Article(
            $articleData->name,
            $articleData->title,
            $articleData->description,
            $articleData->content,
            $this->getLoggedUserOrFail(),
        );

        $articleRepository->save($article);

        return $this->json($article);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(
        Article           $article,
        ArticleRepository $articleRepository,
        #[MapRequestPayload]
        ArticleData       $articleData,
    ): JsonResponse
    {
        $article->update(
            $articleData->name,
            $articleData->title,
            $articleData->description,
            $articleData->content
        );

        $articleRepository->save($article);
        return $this->json($article);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    public function remove(Article $article, ArticleRepository $articleRepository): JsonResponse
    {
        $articleRepository->remove($article);
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
