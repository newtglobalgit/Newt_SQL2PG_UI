export class Database {
    public createdBy: string;
    public runId: string;
    public sourceDBName: string;
    public sourceDBSchema: string;
    public sourceDBHost: string;
    public sourceDBPort: string;
    public targetDBName: string;
    public targetDBHost: string;
    public targetDBPort: string;
    public step: string;
    public stepStatus: string;
    public lastUpdated: string;
  
    constructor(createdBy: string,
                runId: string, 
                sourceDBName: string, 
                sourceDBSchema: string, 
                sourceDBHost: string, 
                sourceDBPort: string, 
                targetDBName: string, 
                targetDBHost: string, 
                targetDBPort: string, 
                step: string, 
                stepStatus: string, 
                lastUpdated: string) {
      this.createdBy = createdBy;
      this.runId = runId;
      this.sourceDBName = sourceDBName;
      this.sourceDBSchema = sourceDBSchema;
      this.sourceDBHost = sourceDBHost;
      this.sourceDBPort = sourceDBPort;
      this.targetDBName = targetDBName;
      this.targetDBHost = targetDBHost;
      this.targetDBPort = targetDBPort;
      this.step = step;
      this.stepStatus = stepStatus;
      this.lastUpdated = lastUpdated;
    }

    
  }