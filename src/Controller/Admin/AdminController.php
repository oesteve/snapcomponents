<?php

namespace App\Controller\Admin;

use App\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/admin')]
final class AdminController extends AbstractController
{
    #[Route('{path}', name: 'app_admin', requirements: ['path' => '.+'], defaults: ['path' => ''])]
    public function index(): Response
    {
        return $this->render('admin/list.html.twig');
    }
}
