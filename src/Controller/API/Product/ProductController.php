<?php

namespace App\Controller\API\Product;

use App\Controller\AbstractController;
use App\Service\Product\ProductSearchService;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;


#[Route('/api/products')]
class ProductController extends AbstractController
{
    #[Route('/search', methods: ['GET'])]
    public function search(
        ProductSearchService $productSearchService,
        Request $request
    ): JsonResponse
    {
        $query = $request->query->get('query');

        return $this->json($productSearchService->search($query));
    }

}
