export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string;
          name: string;
          code: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          code?: string;
          updated_at?: string;
        };
      };
      customers: {
        Row: {
          id: string;
          organization_id: string;
          code: string;
          name: string;
          phone: string;
          address: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          code?: string;
          name: string;
          phone: string;
          address?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          phone?: string;
          address?: string | null;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          organization_id: string;
          customer_id: string;
          code: string;
          name: string;
          type: 'interior' | 'exterior';
          status: 'new' | 'in_progress' | 'render_review' | 'estimating' | 'quote_sent' | 'accepted' | 'rejected';
          assigned_sale_id: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          customer_id: string;
          code?: string;
          name: string;
          type: 'interior' | 'exterior';
          status?: 'new' | 'in_progress' | 'render_review' | 'estimating' | 'quote_sent' | 'accepted' | 'rejected';
          assigned_sale_id?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          status?: 'new' | 'in_progress' | 'render_review' | 'estimating' | 'quote_sent' | 'accepted' | 'rejected';
          updated_at?: string;
        };
      };
      quotes: {
        Row: {
          id: string;
          organization_id: string;
          project_id: string;
          code: string;
          public_token: string;
          status: 'draft' | 'sent' | 'accepted' | 'rejected';
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          project_id: string;
          code?: string;
          public_token: string;
          status?: 'draft' | 'sent' | 'accepted' | 'rejected';
          total_amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: 'draft' | 'sent' | 'accepted' | 'rejected';
          updated_at?: string;
        };
      };
    };
  };
}
