<?php

namespace App\Controller\API\Product;

use App\Controller\AbstractController;
use App\Repository\ProductRepository;
use App\Service\Product\ProductSearchService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api/products', format: 'json')]
class ProductController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(
        ProductRepository $productRepository,
    ): JsonResponse {
        return $this->json(
            $productRepository->findAll(),
        );
    }

    #[Route('/search', methods: ['GET'])]
    public function search(
        ProductSearchService $productSearchService,
        Request $request,
    ): JsonResponse {
        $query = $request->query->get('query');

        return $this->json($productSearchService->search($query));
    }
}
