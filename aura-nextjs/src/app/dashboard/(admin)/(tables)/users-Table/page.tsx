'use client';
import ComponentCard from '@/components/ui/dashboard/common/ComponentCard';
import PageBreadcrumb from '@/components/ui/dashboard/common/PageBreadCrumb';
import Badge from '@/components/ui/dashboard/ui/badge/Badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from '@/components/ui/dashboard/ui/table';
import React from 'react';
import Image from 'next/image';
import { User } from '@/entities/user-entity';
import {
  getUsers,
  unblockUser,
  blockUser,
} from '@/utils/services/user-services/user-services';
import cookie from 'js-cookie';
import { Modal } from '@/components/ui/dashboard/ui/modal';
import { useUser } from '@/components/context';
import { Loader } from '@/components/common/loader';

export default function UserTable() {
  const [users, setUsers] = React.useState<User[]>([]);
  const [edit, setEdit] = React.useState<User | null>(null);
  const [isOpen, setIsOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const me = useUser();

  React.useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const jwt = cookie.get('jwt');
      const response = await getUsers(jwt || '', true);
      if (response.error) {
        setLoading(false);
        // console.error("Error fetching users:", response.error);
        return;
      }
      setUsers(response.data);
      setLoading(false);
      // console.log("Fetched users:", response.data);
    };
    fetchUsers();
  }, []);

  function toggleModal(user: User) {
    setEdit(user);
    setIsOpen(!isOpen);
  }

  function handleBlockUser() {
    // Implement the logic to block the user with the given userId
    if (edit?.blocked && edit?.id) {
      unblockUser(cookie.get('jwt') || '', edit.id).then((response) => {
        if (response.error) {
          // console.error("Error unblocking user:", response.error);
          return;
        }
        setIsOpen(!isOpen);
        // console.log("unblocking user:", edit);
      });
    } else if (edit?.id) {
      blockUser(cookie.get('jwt') || '', edit.id).then((response) => {
        if (response.error) {
          // console.error("Error blocking user:", response.error);
          return;
        }
        setIsOpen(!isOpen);
        // console.log("blocking user:", edit);
      });
    }
  }
  return (
    <div>
      <PageBreadcrumb pageTitle='users Table' />
      <div className='space-y-6'>
        <ComponentCard title='users Table'>
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]'>
            <div className='max-w-full overflow-x-auto'>
              <div className='min-w-[1102px]'>
                {loading ? (
                  <div className='flex items-center justify-center w-full h-6'>
                    <Loader />
                  </div>
                ) : users.length === 0 ? (
                  <div className='overflow-hidden rounded-2xl border border-gray-200 bg-white px-4 pb-3 pt-4 dark:border-gray-800 dark:bg-white/[0.03] sm:px-6'>
                    <div className='flex flex-col gap-2 mb-4 sm:flex-row sm:items-center sm:justify-between'>
                      <div>
                        <h3 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
                          Users
                        </h3>
                      </div>
                    </div>
                    <p className='text-center text-gray-500'>
                      No Users available
                    </p>
                  </div>
                ) : (
                  <Table>
                    {/* Table Header */}
                    <TableHeader className='border-b border-gray-100 dark:border-white/[0.05]'>
                      <TableRow>
                        <TableCell
                          isHeader
                          className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                          User
                        </TableCell>

                        <TableCell
                          isHeader
                          className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                          Status
                        </TableCell>
                        <TableCell
                          isHeader
                          className='px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400'>
                          Operation
                        </TableCell>
                      </TableRow>
                    </TableHeader>

                    {/* Table Body */}
                    <TableBody className='divide-y divide-gray-100 dark:divide-white/[0.05]'>
                      {users.map(
                        (user) =>
                          user.id !== me?.id && (
                            <TableRow key={user.id}>
                              <TableCell className='px-5 py-4 sm:px-6 text-start'>
                                <div className='flex items-center gap-3'>
                                  <div className='w-10 h-10 overflow-hidden rounded-full'>
                                    <Image
                                      width={40}
                                      height={40}
                                      src='/images/default-avatar.png'
                                      alt={user.username}
                                    />
                                  </div>
                                  <div>
                                    <span className='block font-medium text-gray-800 text-theme-sm dark:text-white/90'>
                                      {user.username}
                                    </span>
                                    <span className='block text-gray-500 text-theme-xs dark:text-gray-400'>
                                      {user.role.name}
                                    </span>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                                <Badge
                                  size='sm'
                                  color={
                                    user.blocked
                                      ? 'error'
                                      : user.confirmed
                                      ? 'success'
                                      : 'warning'
                                  }>
                                  {user.blocked
                                    ? 'Blocked'
                                    : user.confirmed
                                    ? 'Confirmed'
                                    : 'need to confirm'}
                                </Badge>
                              </TableCell>
                              <TableCell className='px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400'>
                                <button
                                  onClick={() => toggleModal(user)}
                                  className={`px-4 py-2 text-sm font-medium rounded-full text-white ${
                                    user.blocked
                                      ? 'bg-green-600 rounded-md hover:bg-green-700'
                                      : 'bg-red-800 rounded-md hover:bg-red-900'
                                  }`}>
                                  {user.blocked ? 'Unblock' : 'Block'}
                                </button>
                              </TableCell>
                            </TableRow>
                          )
                      )}
                    </TableBody>
                  </Table>
                )}
              </div>
            </div>
          </div>
        </ComponentCard>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(!isOpen)}
        className='w-full h-[340px] justify-center justify-items-center max-w-md'>
        <div className='pt-26 p-6 justify-items-center justify-center items-center'>
          <h2 className='text-lg font-semibold text-gray-800 dark:text-white/90'>
            {edit?.blocked
              ? 'are you sure you want to unblock user?'
              : `are you sure you want to block user?`}
          </h2>
          <p className='mt-2 text-gray-500 dark:text-gray-400'>
            {edit?.blocked
              ? 'unblocking a user will allow them from accessing their account and using the application.'
              : 'Blocking a user will prevent them from accessing their account and using the application.'}
          </p>
          <div className='mt-4 gap-4 flex justify-end'>
            <button
              className={`px-4 py-2 text-sm font-medium text-white rounded-2xl ${
                edit?.blocked
                  ? 'bg-green-600 hover:bg-green-700'
                  : 'bg-red-600 hover:bg-red-700'
              }`}
              onClick={handleBlockUser}
              // Handle block user action
            >
              {edit?.blocked ? 'Unblock User' : 'Block User'}
            </button>
            <button
              className='ml-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300'
              onClick={() => setIsOpen(!isOpen)}>
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
