class RecintosZoo {
    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanhoTotal: 10, animaisExistentes: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanhoTotal: 5, animaisExistentes: [] },
            { numero: 3, bioma: 'savana e rio', tamanhoTotal: 7, animaisExistentes: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanhoTotal: 8, animaisExistentes: [] },
            { numero: 5, bioma: 'savana', tamanhoTotal: 9, animaisExistentes: [{ especie: 'LEAO', quantidade: 1 }] }
        ];
        
        this.animais = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true, especie: 'LEAO' },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true, especie: 'LEOPARDO' },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true, especie: 'CROCODILO' },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false, especie: 'MACACO' },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false, especie: 'GAZELA' },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false, especie: 'HIPOPOTAMO' }
        };
    }

    analisaRecintos(especie, quantidade) {
        if (!this.animais[especie]) {
            return { erro: 'Animal inválido' };
        }

        if (quantidade <= 0 || !Number.isInteger(quantidade)) {
            return { erro: 'Quantidade inválida' };
        }

        const animal = this.animais[especie];
        const recintosViaveis = this.recintos
            .filter((recinto) => this.ehRecintoViavel(recinto, animal, quantidade))
            .map((recinto) => this.formatarRecinto(recinto, animal, quantidade));

        if (recintosViaveis.length === 0) {
            return { erro: 'Não há recinto viável' };
        }
        return { erro: null, recintosViaveis };
    }

    ehRecintoViavel(recinto, animal, quantidade) {
        if (!animal.biomas.some(bioma => recinto.bioma.includes(bioma))) {
            return false;
        }
        const temCarnivoroExistente = recinto.animaisExistentes.some(existingAnimal => {
            const infoAnimalExistente = this.animais[existingAnimal.especie];
            return infoAnimalExistente.carnivoro;
        });

        if (temCarnivoroExistente && !this.ehMesmaEspecie(recinto, animal)) {
            return false;
        }

        const espacoNecessario = this.calcularEspacoNecessario(recinto, animal, quantidade);
        const espacoDisponivel = this.calcularEspacoDisponivel(recinto);

        return espacoDisponivel >= espacoNecessario;
    }

    calcularEspacoNecessario(recinto, animal, quantidade) {
        let espacoNecessario = animal.tamanho * quantidade;

        if (recinto.animaisExistentes.length > 0 && !this.ehMesmaEspecie(recinto, animal)) {
            espacoNecessario += animal.tamanho;
        }

        return espacoNecessario;
    }

    calcularEspacoDisponivel(recinto) {
        const espacoOcupado = recinto.animaisExistentes.reduce((total, animal) => {
            const infoAnimal = this.animais[animal.especie];
            return total + infoAnimal.tamanho * animal.quantidade;
        }, 0);

        return recinto.tamanhoTotal - espacoOcupado;
    }

    ehMesmaEspecie(recinto, novoAnimal) {
        return recinto.animaisExistentes.every(a => a.especie === novoAnimal.especie);
    }

    formatarRecinto(recinto, animal, quantidade) {
        const espacoDisponivel = this.calcularEspacoDisponivel(recinto) - this.calcularEspacoNecessario(recinto, animal, quantidade);
        return `Recinto ${recinto.numero} (espaço livre: ${espacoDisponivel} total: ${recinto.tamanhoTotal})`;
    }
}

export { RecintosZoo };
