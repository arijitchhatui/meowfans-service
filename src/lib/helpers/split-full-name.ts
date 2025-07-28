import { REMOVE_SPACE_REGEX } from '../../services/auth';

export const splitFullName = (fullName: string): { firstName: string; lastName: string } => {
  const nameParts = fullName.trim().split(REMOVE_SPACE_REGEX);
  const hasLastName = nameParts.length > 1;

  const firstName = hasLastName ? nameParts.slice(0, -1).join(' ') : fullName.trim();
  const lastName = (hasLastName ? nameParts[nameParts.length - 1] : null) || '';

  return { firstName, lastName };
};
