export const modifyFullName = (fullName: string) => {
	// Function to add "+" between first and last name for avatar URL
	// Trim any whitespace and replace multiple spaces with a single space
	let trimmedName = fullName.trim().replace(/\s+/g, " ");

	// Split the name into parts and join with a "+"
	let modifiedName = trimmedName.split(" ").join("+");

	return modifiedName;
};
