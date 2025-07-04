package com.timbanbonchan.client;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

/**
 * RecyclerView adapter for displaying contacts list
 */
public class ContactsAdapter extends RecyclerView.Adapter<ContactsAdapter.ContactViewHolder> {
    
    private Context context;
    private List<Contact> contactsList;
    private OnContactClickListener onContactClickListener;

    public interface OnContactClickListener {
        void onContactClick(Contact contact, int position);
    }

    public ContactsAdapter(Context context, List<Contact> contactsList) {
        this.context = context;
        this.contactsList = contactsList;
    }

    public void setOnContactClickListener(OnContactClickListener listener) {
        this.onContactClickListener = listener;
    }

    @NonNull
    @Override
    public ContactViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_contact, parent, false);
        return new ContactViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ContactViewHolder holder, int position) {
        Contact contact = contactsList.get(position);
        
        // Set contact name
        holder.textViewContactName.setText(contact.getName());
        
        // Set contact phone
        holder.textViewContactPhone.setText(contact.getPhoneNumber());
        
        // Set contact email (if available)
        if (contact.getEmail() != null && !contact.getEmail().isEmpty()) {
            holder.textViewContactEmail.setText(contact.getEmail());
            holder.textViewContactEmail.setVisibility(View.VISIBLE);
        } else {
            holder.textViewContactEmail.setVisibility(View.GONE);
        }
        
        // Set profile image (default to first letter of name)
        setProfileImage(holder.imageViewProfile, contact);
        
        // Set click listener
        holder.itemView.setOnClickListener(v -> {
            if (onContactClickListener != null) {
                onContactClickListener.onContactClick(contact, position);
            }
        });
    }

    private void setProfileImage(ImageView imageView, Contact contact) {
        // For now, we'll just use a default image or text
        // In a real app, you would load the image using libraries like Glide or Picasso
        
        if (contact.getProfileImageUrl() != null && !contact.getProfileImageUrl().isEmpty()) {
            // Load image from URL using image loading library
            // Glide.with(context).load(contact.getProfileImageUrl()).into(imageView);
            
            // For now, use default
            imageView.setImageResource(R.drawable.ic_default_profile);
        } else {
            // Use default profile image
            imageView.setImageResource(R.drawable.ic_default_profile);
        }
    }

    @Override
    public int getItemCount() {
        return contactsList != null ? contactsList.size() : 0;
    }

    public void updateContactsList(List<Contact> newContactsList) {
        this.contactsList = newContactsList;
        notifyDataSetChanged();
    }

    public static class ContactViewHolder extends RecyclerView.ViewHolder {
        ImageView imageViewProfile;
        TextView textViewContactName;
        TextView textViewContactPhone;
        TextView textViewContactEmail;

        public ContactViewHolder(@NonNull View itemView) {
            super(itemView);
            imageViewProfile = itemView.findViewById(R.id.imageViewProfile);
            textViewContactName = itemView.findViewById(R.id.textViewContactName);
            textViewContactPhone = itemView.findViewById(R.id.textViewContactPhone);
            textViewContactEmail = itemView.findViewById(R.id.textViewContactEmail);
        }
    }
}