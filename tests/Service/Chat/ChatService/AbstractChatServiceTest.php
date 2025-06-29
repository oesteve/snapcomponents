<?php

namespace App\Tests\Service\Chat\ChatService;

use App\Entity\Agent;
use App\Entity\ChatConfiguration;
use App\Entity\ChatIntent;
use App\Entity\User;
use App\Repository\AgentRepository;
use App\Repository\ChatConfigurationRepository;
use App\Repository\UserRepository;
use App\Service\Agent\AgentIdentifierProvider;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\HttpKernel\KernelInterface;

abstract class AbstractChatServiceTest extends KernelTestCase
{

    protected function setUp(): void
    {
        parent::setUp();

        $kernel = self::bootKernel();
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
        $mock = $this->getMockBuilder(AgentIdentifierProvider::class)
            ->disableOriginalConstructor()
            ->getMock();

        $mock->method('getCode')->willReturn($agent->getCode());
        static::getContainer()->set(AgentIdentifierProvider::class, $mock);

        $em->flush();
    }

    /**
     * @return User
     */
    private function createTestUser(): User
    {
        $user = new User(
            'test@example.com',
            [User::ROLE_USER],
        );
        static::getContainer()->get(UserRepository::class)->save($user);
        return $user;
    }

    /**
     * @param User $user
     * @return Agent
     */
    private function createTestAgent(User $user): Agent
    {
        $agent = new Agent(
            'test',
            $user,
        );
        static::getContainer()->get(AgentRepository::class)->save($agent);
        return $agent;
    }

    /**
     * @param Agent $agent
     * @return ChatConfiguration
     */
    private function createTestConfiguration(Agent $agent): ChatConfiguration
    {
        $configuration = new ChatConfiguration(
            'test',
            'Test configuration',
            'Act as a useful assistant',
            $agent
        );
        static::getContainer()->get(ChatConfigurationRepository::class)->save($configuration);
        return $configuration;
    }

    /**
     * @param KernelInterface $kernel
     * @return void
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
    protected function withIntents(ChatConfiguration $configuration): array{

        return [];
    }

    /**
     * @template T
     * @param class-string<T> $class
     * @return T
     * @throws \LogicException
     */
    protected function getService(string $class): mixed
    {
        $service = static::getContainer()->get($class);

        if (!$service) {
            throw new \LogicException(sprintf('Service "%s" not found in container', $class));
        }

        return $service;
    }
}
