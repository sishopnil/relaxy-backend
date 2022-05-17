import { CustomUserRoleDto } from '../user/custom-user-role.dto';

export class UserResponseDto {
  id: string;
  userName: string;
  phone: string;
  email: string;
  roles: CustomUserRoleDto;
  accessToken: string;
}
