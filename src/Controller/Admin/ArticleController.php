<?php

namespace App\Controller\Admin;

use App\Controller\AbstractController;
use App\Repository\ArticleRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin/articles')]
final class ArticleController extends AbstractController
{
    #[Route('', name: 'app_admin_article_list')]
    public function list(
        ArticleRepository $articleRepository
    ): Response
    {
        return $this->render('admin/list.html.twig', [
            'agents' => $articleRepository->findBy([
                'user' => $this->getLoggedUserOrFail()
            ]),
        ]);
    }
}
