import { Controller, Get, Post, Body, UseGuards, Request, Query } from '@nestjs/common';
import { RatingsService } from './ratings.service';
import { CreateRatingDto } from './dto/create-rating.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('ratings')
@UseGuards(JwtAuthGuard)
export class RatingsController {
  constructor(private ratingsService: RatingsService) {}

  @Post()
  @UseGuards(RolesGuard)
  @Roles('user')
  create(@Request() req, @Body() createRatingDto: CreateRatingDto) {
    return this.ratingsService.create(req.user.userId, createRatingDto);
  }

  @Get('my-ratings')
  @UseGuards(RolesGuard)
  @Roles('user')
  getMyRatings(@Request() req) {
    return this.ratingsService.findByUser(req.user.userId);
  }

  @Get('store')
  getStoreRatings(@Query('storeId') storeId: string) {
    return this.ratingsService.findByStore(+storeId);
  }

  @Get('stats')
  @UseGuards(RolesGuard)
  @Roles('admin')
  getStats() {
    return this.ratingsService.getStats();
  }

  @Get('average')
  getAverage(@Query('storeId') storeId: string) {
    return this.ratingsService.getAverageForStore(+storeId);
  }
}
