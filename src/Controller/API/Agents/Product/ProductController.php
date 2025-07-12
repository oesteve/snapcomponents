<?php

namespace App\Controller\API\Agents\Product;

use App\Controller\AbstractController;
use App\Entity\Agent;
use App\Repository\ProductRepository;
use App\Service\Product\ProductSearchService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/agents/{agentId:agent.id}/products', format: 'json')]
class ProductController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    #[IsGranted('AGENT_VIEW', 'agent')]
    public function list(
        Agent $agent,
        ProductRepository $productRepository,
    ): JsonResponse {
        return $this->json(
            $productRepository->findAll(),
        );
    }

    #[Route('/search', methods: ['GET'])]
    #[IsGranted('AGENT_VIEW', 'agent')]
    public function search(
        Agent $agent,
        ProductSearchService $productSearchService,
        Request $request,
    ): JsonResponse {
        $query = $request->query->get('query');

        return $this->json($productSearchService->search($query));
    }
}
