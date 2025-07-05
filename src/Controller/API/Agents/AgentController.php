<?php

namespace App\Controller\API\Agents;

use App\Controller\AbstractController;
use App\Controller\API\Agents\DTO\AgentData;
use App\Entity\Agent;
use App\Repository\AgentRepository;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;


#[Route('/api/agents', format: 'json')]
#[IsGranted('ROLE_ADMIN')]
class AgentController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function list(
        AgentRepository $agentRepository,
    ): JsonResponse
    {

        return $this->json($agentRepository->findAll());
    }

    #[Route('', methods: ['POST'])]
    public function create(
        #[MapRequestPayload]
        AgentData       $agentData,
        AgentRepository $agentRepository,
    ): JsonResponse
    {
        $agent = new Agent(
            $agentData->name,
            $this->getLoggedUserOrFail(),
        );

        $agentRepository->save($agent);

        return $this->json($agent);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function get(
        Agent $agent,
    ): JsonResponse
    {
        return $this->json(
            $agent,
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::ALLOW_EXTRA_ATTRIBUTES => [
                    'chatConfiguration'
                ]
            ]
        );
    }

    #[Route('/{id}', methods: ['PUT'])]
    public function update(
        Agent           $agent,
        AgentRepository $agentRepository,
        #[MapRequestPayload]
        AgentData       $agentData,
    ): JsonResponse
    {
        $agent->update(
            $agentData->name,
        );

        $agentRepository->save($agent);
        return $this->json($agent);
    }


    #[Route('/{id}', methods: ['DELETE'])]
    public function remove(Agent $agent, AgentRepository $agentRepository): JsonResponse
    {
        $agentRepository->remove($agent);
        return $this->json(null, Response::HTTP_NO_CONTENT);
    }

}
