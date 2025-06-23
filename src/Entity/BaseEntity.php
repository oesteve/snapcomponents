<?php

namespace App\Entity;

use Gedmo\Timestampable\Traits\TimestampableEntity;
use Gedmo\Blameable\Traits\BlameableEntity;



abstract class BaseEntity
{
 use TimestampableEntity;
 use BlameableEntity;
}
