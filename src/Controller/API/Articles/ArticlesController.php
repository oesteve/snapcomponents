<?php

namespace App\Controller\API\Articles;

use App\Controller\AbstractController;
use App\Controller\API\Articles\DTO\ArticleData;
use App\Entity\Article;
use App\Repository\ArticleCategoryRepository;
use App\Repository\ArticleRepository;
use App\Service\Import\ArticleImportService;
use App\Service\Search\ArticleSearchService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
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

    #[Route('/search', methods: ['GET'])]
    public function get(
        ArticleSearchService $articleService,
        Request              $request
    ): JsonResponse
    {
        $query = $request->query->get('query');
        $results = $articleService->search($query);

        return $this->json($results);
    }

    #[Route('/categories', methods: ['GET'])]
    public function categories(
        ArticleCategoryRepository $categoryRepository,
    ): JsonResponse
    {
        return $this->json($categoryRepository->findAll());
    }

    #[Route('', methods: ['POST'])]
    public function create(
        #[MapRequestPayload]
        ArticleData       $articleData,
        ArticleRepository $articleRepository,
        ArticleCategoryRepository $categoryRepository,
    ): JsonResponse
    {
        $category = $categoryRepository->findOrFail($articleData->categoryId);

        $article = new Article(
            $articleData->title,
            $articleData->description,
            $articleData->content,
            $this->getLoggedUserOrFail(),
            $category
        );

        $articleRepository->save($article);

        return $this->json($article);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(
        Article           $article,
        ArticleRepository $articleRepository,
        ArticleCategoryRepository $categoryRepository,
        #[MapRequestPayload]
        ArticleData       $articleData,
    ): JsonResponse
    {
        $category = $categoryRepository->findOrFail($articleData->categoryId);

        $article->update(
            $articleData->title,
            $articleData->description,
            $articleData->content,
            $category
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

    #[Route('/import/csv', methods: ['POST'])]
    public function importCsv(
        Request $request,
        ArticleImportService $importService
    ): JsonResponse
    {
        // Check if a file was uploaded
        $file = $request->files->get('file');
        if (!$file) {
            return $this->json(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }

        // Get the current user
        $user = $this->getLoggedUserOrFail();

        // Import the articles
        $result = $importService->importFromCsv($file, $user);

        // Prepare the response
        $response = [
            'success' => count($result['success']),
            'errors' => $result['errors'],
            'articles' => $result['success'],
        ];

        // Return a 207 Multi-Status response if there are errors
        $statusCode = !empty($result['errors'])
            ? Response::HTTP_MULTI_STATUS
            : Response::HTTP_OK;

        return $this->json($response, $statusCode);
    }
}
