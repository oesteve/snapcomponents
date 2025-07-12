<?php

namespace App\Controller\API\Agents;

use App\Controller\AbstractController;
use App\Controller\API\Agents\DTO\AgentData;
use App\Entity\Agent;
use App\Repository\AgentRepository;
use App\Serializer\SerializerGroups;
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
    ): JsonResponse {
        return $this->json($agentRepository->findAll(), Response::HTTP_OK, [], [
            AbstractNormalizer::GROUPS => [
                SerializerGroups::API_LIST,
            ],
        ]);
    }

    #[Route('', methods: ['POST'])]
    public function create(
        #[MapRequestPayload]
        AgentData $agentData,
        AgentRepository $agentRepository,
    ): JsonResponse {
        // No need for voter validation here as we're creating a new agent
        // The user will automatically be the owner of the agent
        $agent = new Agent(
            $agentData->name,
            $this->getLoggedUserOrFail(),
        );

        $agentRepository->save($agent);

        return $this->json($agent,
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [
                    SerializerGroups::API_LIST,
                ],
            ]
        );
    }

    #[Route('/{id}', methods: ['GET'])]
    #[IsGranted('AGENT_VIEW', 'agent')]
    public function get(
        Agent $agent,
    ): JsonResponse {
        return $this->json(
            $agent,
            Response::HTTP_OK,
            [],
            [
                AbstractNormalizer::GROUPS => [
                    SerializerGroups::API_LIST,
                ],
            ]
        );
    }

    #[Route('/{id}', methods: ['PUT'])]
    #[IsGranted('AGENT_EDIT', 'agent')]
    public function update(
        Agent $agent,
        AgentRepository $agentRepository,
        #[MapRequestPayload]
        AgentData $agentData,
    ): JsonResponse {
        $agent->update(
            $agentData->name,
        );

        $agentRepository->save($agent);

        return $this->json($agent);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    #[IsGranted('AGENT_EDIT', 'agent')]
    public function remove(Agent $agent, AgentRepository $agentRepository): JsonResponse
    {
        $agentRepository->remove($agent);

        return $this->json(null, Response::HTTP_NO_CONTENT);
    }
}
