export class BaseEntity {
  public readonly id: string;

  public removed: boolean;
  public creator: string;
  public updater: string;
  public remover: string;
  public created_at: Date;
  public updated_at: Date;
  public removed_at: Date | null;

  constructor() {
    this.created_at = new Date();
    this.updated_at = new Date();
    this.removed = false;
    this.removed_at = null;
  }
}
