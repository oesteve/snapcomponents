<?php

namespace App\Controller\API\Agents\Articles;

use App\Controller\AbstractController;
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
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('/api/agents/{agentId:agent.id}/articles', format: 'json')]
class ArticlesController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    #[IsGranted('AGENT_VIEW', 'agent')]
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

    #[Route('/search', methods: ['POST'])]
    #[IsGranted('AGENT_VIEW', 'agent')]
    public function get(
        ArticleSearchService $articleService,
        Agent $agent,
        #[MapRequestPayload]
        Search $search,
    ): JsonResponse {
        $results = $articleService->search(
            $agent,
            $search->query,
        );

        return $this->json($results,
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [SerializerGroups::API_LIST],
            ]
        );
    }

    #[Route('/categories', methods: ['GET'])]
    #[IsGranted('AGENT_VIEW', 'agent')]
    public function categories(
        ArticleCategoryRepository $categoryRepository,
        Agent $agent,
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
    #[IsGranted('AGENT_EDIT', 'agent')]
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
    #[IsGranted('AGENT_EDIT', 'agent')]
    public function update(
        Agent $agent,
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
    #[IsGranted('AGENT_EDIT', 'agent')]
    public function remove(
        Article $article,
        Agent $agent,
        ArticleRepository $articleRepository,
    ): JsonResponse {
        $articleRepository->remove($article);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

    #[Route('/import/csv', methods: ['POST'])]
    #[IsGranted('AGENT_EDIT', 'agent')]
    public function importCsv(
        Request $request,
        ArticleImportService $importService,
        AgentRepository $agentRepository,
        Agent $agent,
    ): JsonResponse {
        // Check if a file was uploaded
        $file = $request->files->get('file');
        if (!$file) {
            return $this->json(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }

        // Check if the user has edit permission for the agent
        $this->denyAccessUnlessGranted('AGENT_EDIT', $agent);

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
