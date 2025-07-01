<?php

namespace App\Command;

use App\Entity\Product;
use App\Repository\ProductRepository;
use App\Repository\UserRepository;
use App\Service\Product\ProductData;
use App\Service\Product\ProductProvider;
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
        private ProductProvider $productProvider,
        private ProductRepository $productRepository,
        private UserRepository $userRepository
    )
    {
        parent::__construct();
    }

    protected function configure(): void
    {
        $this
            ->addArgument('userId', InputArgument::REQUIRED, 'Id of the user')
            ->addOption('option1', null, InputOption::VALUE_NONE, 'Option description')
        ;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $userId = (int) $input->getArgument('userId');

        foreach ($this->productProvider->getProducts() as $productData){

            $product = $this->productRepository->findOneBy([
                'user' => $userId,
                'name' => $productData->name,
            ]);


            if (!$product){
                $product = new Product(
                    $productData->name,
                    $productData->title,
                    $productData->description,
                    $productData->image,
                    $productData->price,
                    $this->userRepository->findOrFail($userId)
                );
            }else{
                $product->update(
                    $productData->name,
                    $productData->title,
                    $productData->description,
                    $productData->image,
                    $productData->price,
                );
            }

            $this->productRepository->save($product);

        }


        $io->success('You have a new command! Now make it your own! Pass --help to see your options.');

        return Command::SUCCESS;
    }
}
