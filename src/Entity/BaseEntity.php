<?php

namespace App\Entity;

use Gedmo\Blameable\Traits\BlameableEntity;
use Gedmo\Timestampable\Traits\TimestampableEntity;

abstract class BaseEntity
{
    use TimestampableEntity;
    use BlameableEntity;
}
