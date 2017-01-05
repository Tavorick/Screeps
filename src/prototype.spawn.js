var listOfRoles = ['harvester', 'transporter', 'upgrader', 'repairer', 'builder', 'miner','longrangeharvester'];

// create a new function for StructureSpawn
StructureSpawn.prototype.spawnCreepsIfNecessary =
    function () {
        /** @type {Room} */
        let room = this.room;
        // find all creeps in room
        /** @type {Array.<Creep>} */
        let creepsInRoom = room.find(FIND_MY_CREEPS);

        let defaultmincreeps = ['harvester', 'transporter', 'upgrader', 'repairer', 'builder', 'miner','sentrydrone'];
        defaultmincreeps['harvester'] = 1;
        defaultmincreeps['transporter'] = 2;
        defaultmincreeps['upgrader'] = 6;
        defaultmincreeps['repairer'] = 2;
        defaultmincreeps['builder'] = 2;
        defaultmincreeps['miner'] = 2;
        defaultmincreeps['sentrydrone'] = 1;

        let hostiles = room.find(FIND_HOSTILE_CREEPS);

        if (hostiles.length != 0)
        {
            defaultmincreeps['harvester'] = 4;
            defaultmincreeps['transporter'] = 0;
            defaultmincreeps['upgrader'] = 0;
            defaultmincreeps['repairer'] = 2;
            defaultmincreeps['builder'] = 0;
            defaultmincreeps['miner'] = 0;
            defaultmincreeps['sentrydrone'] = 6;
        }
        // count the number of creeps alive for each role in this room
        // _.sum will count the number of properties in Game.creeps filtered by the
        //  arrow function, which checks for the creep being a specific role
        /** @type {Object.<string, number>} */
        let numberOfCreeps = {};
        for (let role of listOfRoles)
        {
            numberOfCreeps[role] = _.sum(creepsInRoom, (c) => c.memory.role == role);
        }
        let maxEnergy = room.energyCapacityAvailable;
        let name = undefined;

        // if no harvesters are left AND either no miners or no transporters are left
        //  create a backup creep
        if (numberOfCreeps['harvester'] == 0 && numberOfCreeps['transporter'] == 0)
        {
            // if there are still miners or enough energy in Storage left
            if (numberOfCreeps['miner'] > 0 ||
                (room.storage != undefined && room.storage.store[RESOURCE_ENERGY] >= 150 + 550))
            {
                // create a transporter
                name = this.createtransporter(150);
            }
            // if there is no miner and not enough energy in Storage left
            else {
                // create a harvester because it can work on its own
                name = this.createCustomCreep(room.energyAvailable, 'harvester');
            }
        }
        // if no backup creep is required
        else {
            // check if all sources have miners
            let sources = room.find(FIND_SOURCES);
            // iterate over all sources
            for (let source of sources)
            {
                // if the source has no miner
                if (!_.some(creepsInRoom, c => c.memory.role == 'miner' && c.memory.sourceId == source.id))
                {
                    // check whether or not the source has a container
                    /** @type {Array.StructureContainer} */
                    let containers = source.pos.findInRange(FIND_STRUCTURES, 1,
                        {
                        filter: s => s.structureType == STRUCTURE_CONTAINER
                    });
                    // if there is a container next to the source
                    if (containers.length > 0)
                    {
                        // spawn a miner
                        name = this.createMiner(source.id);
                        break;
                    }
                }
            }
        }
        // if none of the above caused a spawn command check for other roles
        if (name == undefined)
        {
            for (let role of listOfRoles)
            {
                if (numberOfCreeps[role] < defaultmincreeps[role])
                {
                    if (role == 'transporter')
                    {
                        name = this.createtransporter(150);
                    }
                    else if (role == 'sentrydrone')
                    {
                        name = this.CreateSentryDrone(maxEnergy);
                    }
                    else
                    {
                        name = this.createCustomCreep(maxEnergy, role);
                    }
                    break;
                }
            }
        }

        let numberOfLongDistanceHarvesters = {};
        if (name == undefined) {
            // count the number of long distance harvesters globally
            for (let roomName in this.memory.minLongDistanceHarvesters)
            {
                numberOfLongDistanceHarvesters[roomName] = _.sum(Game.creeps, (c) =>
                c.memory.role == 'longrangeharvester' && c.memory.target == roomName)

                if (numberOfLongDistanceHarvesters[roomName] < this.memory.minLongDistanceHarvesters[roomName])
                {
                    name = this.createLongDistanceHarvester(maxEnergy, 2, room.name, roomName, 0);
                }
            }
        }

        // print name to console if spawning was a success
        if (name != undefined && _.isString(name))
        {
            console.log(this.name + " spawned new creep: " + name + " (" + Game.creeps[name].memory.role + ")");
            for (let role of listOfRoles) {
                console.log(role + ": " + numberOfCreeps[role]);
            }
        }
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createCustomCreep =
    function (energy, roleName) {
        // create a balanced body as big as possible with the given energy
        var numberOfParts = Math.floor(energy / 200);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body = [];
        for (let i = 0; i < numberOfParts; i++)
        {
            body.push(WORK);
        }
        for (let i = 0; i < numberOfParts; i++)
        {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++)
        {
            body.push(MOVE);
        }

        // create creep with the created body and the given role
        return this.createCreep(body, undefined, { role: roleName, working: false });
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createMiner =
    function (sourceId) {
        return this.createCreep([WORK, WORK, WORK, WORK, WORK, MOVE], undefined,
            { role: 'miner', sourceId: sourceId });
    };

// create a new function for StructureSpawn
StructureSpawn.prototype.createtransporter =
    function (energy)
    {
        // create a body with twice as many CARRY as MOVE parts
        var numberOfParts = Math.floor(energy / 150);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor(50 / 3));
        var body = [];
        for (let i = 0; i < numberOfParts * 2; i++)
        {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts; i++)
        {
            body.push(MOVE);
        }

        // create creep with the created body and the role 'transporter'
        return this.createCreep(body, undefined, { role: 'transporter', working: false });
    };

StructureSpawn.prototype.createLongDistanceHarvester =
    function (energy, numberOfWorkParts, home, target, sourceIndex)
    {
        // create a body with the specified number of WORK parts and one MOVE part per non-MOVE part
        var body = [];
        for (let i = 0; i < numberOfWorkParts; i++)
        {
            body.push(WORK);
        }

        // 150 = 100 (cost of WORK) + 50 (cost of MOVE)
        energy -= 150 * numberOfWorkParts;

        var numberOfParts = Math.floor(energy / 100);
        // make sure the creep is not too big (more than 50 parts)
        numberOfParts = Math.min(numberOfParts, Math.floor((50 - numberOfWorkParts * 2) / 2));
        for (let i = 0; i < numberOfParts; i++)
        {
            body.push(CARRY);
        }
        for (let i = 0; i < numberOfParts + numberOfWorkParts; i++)
        {
            body.push(MOVE);
        }

        // create creep with the created body
        return this.createCreep(body, undefined,
            {
            role: 'longrangeharvester',
            home: home,
            target: target,
            sourceIndex: sourceIndex,
            working: false
        });
    };

StructureSpawn.prototype.CreateSentryDrone =
    function (energy)
    {
        let cost = 380;
        let body = [MOVE, TOUGH, ATTACK, ATTACK, RANGED_ATTACK, TOUGH];
        while (cost < energy)
        {
            cost += cost;
            body.push(body);
        }
        return this.createCreep(body, undefined, { role: 'sentrydrone'});
    };