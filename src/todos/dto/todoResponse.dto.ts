export interface TodoResponseDto {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;
  isArchived: boolean;
  isDeleted: boolean;
}
