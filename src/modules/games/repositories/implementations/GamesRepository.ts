import { getRepository, Repository } from "typeorm";

import { User } from "../../../users/entities/User";
import { Game } from "../../entities/Game";

import { IGamesRepository } from "../IGamesRepository";

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    const games = this.repository
      .createQueryBuilder("game")
      .where("game.title ilike :param", { param: `%${param}%` }) // % = pode conter qualquer coisa antes e depois do param
      .getMany();

    return games;
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query(`
    SELECT COUNT(id) FROM games;
    `);
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    // const users = this.repository
    //   .createQueryBuilder("user")
    //   .leftJoinAndSelect("user.games", "relation")
    //   .where("relation.gamesId = :gameId", { gameId: id });

    const users = this.repository.query(
      `SELECT * FROM users JOIN "users_games_games" ON users.id = "users_games_games"."usersId" WHERE "users_games_games"."gamesId" = $1;
    `,
      [id]
    );

    return users;
  }
}
