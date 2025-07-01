<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ComponentsController extends AbstractController
{
    #[Route('/components', name: 'app_components')]
    public function index(): Response
    {
        return $this->render('components/index.html.twig');
    }
}
