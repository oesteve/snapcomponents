<?php

namespace App\Controller\API\Agents\Articles;

use App\Controller\AbstractController;
use App\Controller\API\Agents\Articles\DTO\ArticleData;
use App\Entity\Agent;
use App\Entity\Article;
use App\Repository\AgentRepository;
use App\Repository\ArticleCategoryRepository;
use App\Repository\ArticleRepository;
use App\Serializer\SerializerGroups;
use App\Service\Articles\ArticleSearchService;
use App\Service\Articles\Import\ArticleImportService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapQueryParameter;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('/api/agents/{agentId:agent.id}/articles', format: 'json')]
class ArticlesController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(
        ArticleRepository $articleRepository,
        Agent $agent,
    ): JsonResponse {
        $articles = $articleRepository->findBy([
            'agent' => $agent,
        ]);

        return $this->json($articles, Response::HTTP_OK, [], [
            AbstractNormalizer::GROUPS => [SerializerGroups::API_LIST],
        ]);
    }

    #[Route('/search', methods: ['GET'])]
    public function get(
        ArticleSearchService $articleService,
        Agent $agent,
        #[MapQueryParameter]
        string $query,
    ): JsonResponse {
        $results = $articleService->search(
            $agent,
            $query,
        );

        $data = [
            'results' => $results,
            'categories' => $articleService->getCategories(),
        ];

        return $this->json($data,
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [SerializerGroups::API_LIST],
            ]
        );
    }

    #[Route('/categories', methods: ['GET'])]
    public function categories(
        ArticleCategoryRepository $categoryRepository,
    ): JsonResponse {
        return $this->json(
            $categoryRepository->findAll(),
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [SerializerGroups::API_LIST],
            ]
        );
    }

    #[Route('', methods: ['POST'])]
    public function create(
        #[MapRequestPayload]
        ArticleData $articleData,
        ArticleRepository $articleRepository,
        ArticleCategoryRepository $categoryRepository,
        Agent $agent,
    ): JsonResponse {
        $category = $categoryRepository->findOrFail($articleData->categoryId);

        $article = new Article(
            $articleData->title,
            $articleData->description,
            $articleData->content,
            $agent,
            $category
        );

        $articleRepository->save($article);

        return $this->json(null);
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(
        Article $article,
        ArticleRepository $articleRepository,
        ArticleCategoryRepository $categoryRepository,
        #[MapRequestPayload]
        ArticleData $articleData,
    ): JsonResponse {
        $category = $categoryRepository->findOrFail($articleData->categoryId);

        $article->update(
            $articleData->title,
            $articleData->description,
            $articleData->content,
            $category
        );

        $articleRepository->save($article);

        return $this->json(null);
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
        ArticleImportService $importService,
        AgentRepository $agentRepository,
    ): JsonResponse {
        // Check if a file was uploaded
        $file = $request->files->get('file');
        if (!$file) {
            return $this->json(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }

        // Get the current user
        $user = $this->getLoggedUserOrFail();

        // Get the first agent for the user
        $agent = $agentRepository->findOneBy(['user' => $user]);

        if (!$agent) {
            return $this->json(['error' => 'No agent found for this user'], Response::HTTP_BAD_REQUEST);
        }

        // Import the articles
        $result = $importService->importFromCsv($file, $agent);

        // Prepare the response
        $response = [
            'total_queued' => $result['total'],
            'errors' => $result['errors'],
            'message' => $result['total'] > 0
                ? sprintf('%d articles queued for import', $result['total'])
                : 'No articles queued for import',
        ];

        // Return a 207 Multi-Status response if there are errors
        $statusCode = !empty($result['errors'])
            ? Response::HTTP_MULTI_STATUS
            : Response::HTTP_OK;

        return $this->json($response, $statusCode);
    }
}
