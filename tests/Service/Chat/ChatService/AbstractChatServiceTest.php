<?php

namespace App\Tests\Service\Chat\ChatService;

use App\Entity\Agent;
use App\Entity\ChatConfiguration;
use App\Entity\ChatIntent;
use App\Entity\User;
use App\Kernel;
use App\Repository\AgentRepository;
use App\Repository\ChatConfigurationRepository;
use App\Repository\UserRepository;
use App\Service\Agent\SessionProvider;
use App\Service\Agent\TokenProvider;
use App\Service\Authentication\AuthenticationTokenService;
use App\Tests\BaseTestCase;
use App\Tests\Service\Agent\DummySessionProvider;
use App\Tests\Service\Agent\DummyTokenProvider;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\HttpKernel\KernelInterface;

abstract class AbstractChatServiceTest extends BaseTestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        /** @var Kernel $kernel */
        $kernel = static::$kernel;

        $this->setUpDatabase($kernel);

        $user = $this->createTestUser();
        $agent = $this->createTestAgent($user);
        $configuration = $this->createTestConfiguration($agent);

        $em = $this->getService(EntityManagerInterface::class);

        foreach ($this->withIntents($configuration) as $intent) {
            $em->persist($intent);
            $configuration->setIntent($intent);
        }

        $agent->setChatConfiguration($configuration);

        $token = $this->getService(AuthenticationTokenService::class)
            /* @phpstan-ignore-next-line */
            ->generateToken(['id' => $agent->getId(), 'code' => $agent->getCode()]);

        /** @var DummyTokenProvider $identifier */
        $identifier = $this->getService(TokenProvider::class);
        $identifier
            ->setToken($token);

        /** @var DummySessionProvider $sessionProvider */
        $sessionProvider = $this->getService(SessionProvider::class);
        $sessionProvider
            ->setSessionId('test-session');

        $em->flush();
    }

    private function createTestUser(): User
    {
        $user = new User(
            'test@example.com',
            [User::ROLE_USER],
        );
        $this->getService(UserRepository::class)->save($user);

        return $user;
    }

    private function createTestAgent(User $user): Agent
    {
        $agent = new Agent(
            'test',
            $user,
        );
        static::getService(AgentRepository::class)->save($agent);

        return $agent;
    }

    private function createTestConfiguration(Agent $agent): ChatConfiguration
    {
        $configuration = new ChatConfiguration(
            'test',
            'Test configuration',
            'Act as a useful assistant',
            $agent
        );

        static::getService(ChatConfigurationRepository::class)->save($configuration);

        return $configuration;
    }

    /**
     * @throws \Exception
     */
    private function setUpDatabase(KernelInterface $kernel): void
    {
        // Get the application (console)
        $application = new Application($kernel);
        $application->setAutoExit(false);

        // Prepare the command input to run doctrine:schema:update --force
        $input = new ArrayInput([
            'command' => 'doctrine:schema:update',
            '--force' => true,
        ]);

        // Run the command
        $application->run($input);
    }

    /**
     * @return array<ChatIntent>
     */
    protected function withIntents(ChatConfiguration $configuration): array
    {
        return [];
    }
}
