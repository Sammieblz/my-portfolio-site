declare global {
	namespace App {
		interface Error {
			message: string;
			errorId?: string;
		}
	}
}

export {};
