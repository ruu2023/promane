<?php

namespace App\Traits;

use DateTimeInterface;
use Illuminate\Support\Carbon;

trait SerializesDatesToJst
{
    /**
     * モデルの日付をシリアライズする際のフォーマットを指定
     *
     */
    protected function serializeDate(DateTimeInterface $date): string
    {
        return Carbon::instance($date)
            ->timezone('Asia/Tokyo')
            ->format('c');
    }
}
