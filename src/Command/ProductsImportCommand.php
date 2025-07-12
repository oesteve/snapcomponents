<?php

namespace App\Command;

use App\Repository\AgentRepository;
use App\Service\Product\ElasticSearch\ElasticSearchProductProvider;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Input\InputOption;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:products:import',
    description: 'Add a short description for your command',
)]
class ProductsImportCommand extends Command
{
    public function __construct(
        private readonly ElasticSearchProductProvider $productSearchService,
        private readonly AgentRepository $agentRepository,
    ) {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('agentId', InputArgument::REQUIRED, 'Id of the agent')
            ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(
        InputInterface $input,
        OutputInterface $output,
    ): int {
        $io = new SymfonyStyle($input, $output);
        $agentId = (int) $input->getArgument('agentId');
        $agent = $this->agentRepository->findOrFail($agentId);

        $this->productSearchService->importProducts($agent);

        $io->success('You have a new command! Now make it your own! Pass --help to see your options.');

        return Command::SUCCESS;
    }
}
