import {Column, Entity, OneToMany, PrimaryColumn} from "typeorm";

@Entity()
export class OfflineParticular {
    @PrimaryColumn("uuid")
    id: string;

    @Column(() => () => "text")
    name: string;

    @Column(() => () => "text")
    description: string;

    constructor(id: string, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}

@Entity()
export class OfflineMasterFee {

    @PrimaryColumn("uuid")
    id: string;

    @Column(() => () => "text")
    name: string;

    @Column(() => () => "text")
    description: string;

    @OneToMany(() => OfflineParticular, (particular: OfflineParticular) => particular.id)
    particularSet: OfflineParticular[]

    constructor(id: string, name: string, description: string, particularSet: Array<OfflineParticular>) {
        this.id = id
        this.name = name;
        this.description = description;
        this.particularSet = particularSet;
    }
}

/*
export class OfflineParticular {
    id: number;
    name: string;
    description: string;
    constructor(id: number, name: string, description: string) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}
export class OfflineMasterFee {
    id: number;
    name: string;
    description: string;
    particularSet: OfflineParticular[];

    constructor(id: number, name: string, description: string, particular_set: Array<OfflineParticular>) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.particularSet = particular_set;
    }

}
 */
