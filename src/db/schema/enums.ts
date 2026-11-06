import { pgEnum } from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", ["PENDING", "ACTIVE", "BLOCKED"]);
export const playerStatusEnum = pgEnum("player_status", ["ACTIVE", "INACTIVE"]);
export const teamStatusEnum = pgEnum("team_status", ["ACTIVE", "INACTIVE"]);
export const teamMemberRoleEnum = pgEnum("team_member_role", ["CAPTAIN", "PARTNER"]);

export const tournamentFormatEnum = pgEnum("tournament_format", ["SINGLE_ELIMINATION"]);
export const tournamentStatusEnum = pgEnum("tournament_status", [
  "DRAFT", "REGISTRATION_OPEN", "REGISTRATION_CLOSED", "IN_PROGRESS", "COMPLETED", "CANCELLED",
]);
export const tournamentStaffRoleEnum = pgEnum("tournament_staff_role", ["ADMIN", "REFEREE", "SCORER"]);
export const registrationStatusEnum = pgEnum("registration_status", ["PENDING", "CONFIRMED", "CANCELLED", "DISQUALIFIED"]);
export const stageTypeEnum = pgEnum("stage_type", [
  "ROUND_OF_32", "ROUND_OF_16", "QUARTER_FINAL", "SEMI_FINAL", "FINAL", "CUSTOM",
]);
export const stageStatusEnum = pgEnum("stage_status", ["PENDING", "IN_PROGRESS", "COMPLETED"]);
export const confrontationStatusEnum = pgEnum("confrontation_status", [
  "PENDING", "SCHEDULED", "IN_PROGRESS", "COMPLETED", "CANCELLED", "DISQUALIFIED",
]);
export const slotOutcomeEnum = pgEnum("slot_outcome", ["WINNER", "LOSER"]);

export const gameStatusEnum = pgEnum("game_status", ["WAITING", "IN_PROGRESS", "PAUSED", "COMPLETED", "ABANDONED"]);
export const teamSideEnum = pgEnum("team_side", ["A", "B"]);
export const connectionStatusEnum = pgEnum("connection_status", ["ONLINE", "OFFLINE", "RECONNECTING"]);
export const roundStatusEnum = pgEnum("round_status", ["IN_PROGRESS", "WAITING_RESPONSE", "COMPLETED", "CANCELLED"]);
export const handModeEnum = pgEnum("hand_mode", ["NORMAL", "TEN_HAND", "IRON_HAND"]);
export const trickStatusEnum = pgEnum("trick_status", ["OPEN", "COMPLETED"]);
export const trickWinnerSideEnum = pgEnum("trick_winner_side", ["A", "B", "TIE"]);
export const trucoResponseEnum = pgEnum("truco_response", ["PENDING", "ACCEPTED", "REFUSED"]);
export const scoreEventReasonEnum = pgEnum("score_event_reason", [
  "HAND_WON", "CALL_REFUSED", "MANUAL_ADJUSTMENT", "PENALTY", "CORRECTION",
]);
export const eventVisibilityEnum = pgEnum("event_visibility", ["PUBLIC", "PLAYERS", "INTERNAL"]);

export const cardSuitEnum = pgEnum("card_suit", ["CLUBS", "HEARTS", "SPADES", "DIAMONDS"]);
export const cardRankEnum = pgEnum("card_rank", ["4", "5", "6", "7", "Q", "J", "K", "A", "2", "3"]);
