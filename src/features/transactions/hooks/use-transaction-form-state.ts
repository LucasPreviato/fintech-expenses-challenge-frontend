import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  type TransactionFormValues,
  emptyTransactionFormValues,
  transactionFormSchema,
} from '../lib/transaction-schemas';
import type { Transaction } from '../types/transaction';

function formatAmountForInput(value: string) {
  return value.replace('.', ',');
}

function toDateInputValue(value: string) {
  return new Date(value).toISOString().slice(0, 10);
}

export function useTransactionFormState() {
  const [isFormDrawerOpen, setIsFormDrawerOpen] = useState(false);
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionFormSchema),
    defaultValues: emptyTransactionFormValues,
  });
  const isEditing = Boolean(form.watch('transactionId'));

  function resetForm() {
    form.clearErrors();
    form.reset(emptyTransactionFormValues);
  }

  function openCreateDrawer() {
    setIsFormDrawerOpen(true);
  }

  function closeDrawer() {
    setIsFormDrawerOpen(false);
  }

  function populateForm(transaction: Transaction) {
    form.clearErrors();
    form.reset({
      transactionId: transaction.id,
      description: transaction.description,
      amount: formatAmountForInput(transaction.amount),
      date: toDateInputValue(transaction.date),
      type: transaction.type,
      categoryId: transaction.category.id,
    });
    setIsFormDrawerOpen(true);
  }

  return {
    form,
    isEditing,
    isFormDrawerOpen,
    resetForm,
    openCreateDrawer,
    closeDrawer,
    populateForm,
  };
}
