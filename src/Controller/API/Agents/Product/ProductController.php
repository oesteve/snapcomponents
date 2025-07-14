<?php

namespace App\Controller\API\Agents\Product;

use App\Controller\AbstractController;
use App\Entity\Agent;
use App\Serializer\SerializerGroups;
use App\Service\Product\ProductService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
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
        ProductService $providerFactory,
    ): JsonResponse {
        $products = $providerFactory->list($agent);

        return $this->json(
            $products,
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [SerializerGroups::API_LIST],
            ]
        );
    }

    #[Route('/search', methods: ['POST'])]
    #[IsGranted('AGENT_VIEW', 'agent')]
    public function search(
        Agent $agent,
        ProductService $productService,
        Request $request,
        #[MapRequestPayload]
        Search $search,
    ): JsonResponse {
        $products = $productService->list(
            $agent,
            $search->query,
            []
        );

        return $this->json(
            $products,
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [SerializerGroups::API_LIST],
            ]
        );
    }

    #[Route('/providers', methods: ['GET'])]
    #[IsGranted('AGENT_VIEW', 'agent')]
    public function getAvailableProvider(
        Agent $agent,
        ProductService $productProviderFactory,
    ): JsonResponse {
        $providers = array_map(
            fn (string $provider) => [
                'name' => $provider,
            ],
            $productProviderFactory->getAvailableProviders()
        );

        return $this->json(
            $providers,
            Response::HTTP_OK,
        );
    }

    #[Route('/provider', methods: ['GET'])]
    #[IsGranted('AGENT_VIEW', 'agent')]
    public function getProvider(
        Agent $agent,
        ProductService $factory,
    ): JsonResponse {
        $provider = $factory->getProvider($agent);

        return $this->json(
            [
                'name' => $provider->getName(),
                'settings' => $provider->getSettings(),
            ],
            Response::HTTP_OK,
        );
    }

    #[Route('/provider', methods: ['PUT'])]
    #[IsGranted('AGENT_VIEW', 'agent')]
    public function setProvider(
        Agent $agent,
        ProductService $productService,
        #[MapRequestPayload]
        ProviderData $data,
    ): JsonResponse {
        $productService->setProvider(
            $agent,
            $data->name,
            $data->settings,
        );

        return $this->json(null);
    }
}
