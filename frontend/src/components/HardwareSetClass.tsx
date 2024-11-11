class Hardware {
    name: string;
    quantity: number;
    max: number;
    id: string;

    constructor(id: string, name: string, quantity: number) {
        this.id = id;
        this.name = name;
        this.quantity = quantity;
        this.max = 100;
    }

    setQuantity(number: number){
        this.quantity=number;
    }

    isAvailable() {
        return this.quantity > 0;
    }

    getAvailableCount() {
        return `${this.max}-${this.quantity}`;
    }
}

export default Hardware;