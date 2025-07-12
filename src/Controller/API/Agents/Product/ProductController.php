<?php

namespace App\Controller\API\Agents\Product;

use App\Controller\AbstractController;
use App\Entity\Agent;
use App\Serializer\SerializerGroups;
use App\Service\Product\ProductProviderFactory;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;

#[Route('/api/agents/{agentId:agent.id}/products', format: 'json')]
class ProductController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    #[IsGranted('AGENT_VIEW', 'agent')]
    public function list(
        Agent $agent,
        ProductProviderFactory $providerFactory,
    ): JsonResponse {
        $productProvider = $providerFactory->forAgent($agent);

        return $this->json(
            $productProvider->list(),
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [SerializerGroups::API_LIST],
            ]
        );
    }

    #[Route('/search', methods: ['GET'])]
    #[IsGranted('AGENT_VIEW', 'agent')]
    public function search(
        Agent $agent,
        ProductProviderFactory $productProviderFactory,
        Request $request,
    ): JsonResponse {
        $query = $request->query->getString('query');

        $productProvider = $productProviderFactory->forAgent($agent);

        return $this->json(
            $productProvider->search($query),
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [SerializerGroups::API_LIST],
            ]
        );
    }
}
