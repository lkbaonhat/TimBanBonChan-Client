package com.timbanbonchan.client;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CheckBox;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;
import java.util.List;

/**
 * RecyclerView adapter for group creation with selectable contacts
 */
public class CreateGroupAdapter extends RecyclerView.Adapter<CreateGroupAdapter.SelectableContactViewHolder> {
    
    private Context context;
    private List<Contact> contactsList;
    private OnContactSelectionListener onContactSelectionListener;

    public interface OnContactSelectionListener {
        void onContactSelected(Contact contact, boolean isSelected);
    }

    public CreateGroupAdapter(Context context, List<Contact> contactsList, OnContactSelectionListener listener) {
        this.context = context;
        this.contactsList = contactsList;
        this.onContactSelectionListener = listener;
    }

    @NonNull
    @Override
    public SelectableContactViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(context).inflate(R.layout.item_contact_selectable, parent, false);
        return new SelectableContactViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull SelectableContactViewHolder holder, int position) {
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
        
        // Set profile image
        setProfileImage(holder.imageViewProfile, contact);
        
        // Set checkbox state
        holder.checkBoxSelect.setChecked(contact.isSelected());
        
        // Set checkbox listener
        holder.checkBoxSelect.setOnCheckedChangeListener(null); // Clear previous listener
        holder.checkBoxSelect.setOnCheckedChangeListener((buttonView, isChecked) -> {
            if (onContactSelectionListener != null) {
                onContactSelectionListener.onContactSelected(contact, isChecked);
            }
        });
        
        // Set item click listener to toggle checkbox
        holder.itemView.setOnClickListener(v -> {
            boolean newState = !holder.checkBoxSelect.isChecked();
            holder.checkBoxSelect.setChecked(newState);
        });
    }

    private void setProfileImage(ImageView imageView, Contact contact) {
        // For now, we'll just use a default image
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

    public static class SelectableContactViewHolder extends RecyclerView.ViewHolder {
        ImageView imageViewProfile;
        TextView textViewContactName;
        TextView textViewContactPhone;
        TextView textViewContactEmail;
        CheckBox checkBoxSelect;

        public SelectableContactViewHolder(@NonNull View itemView) {
            super(itemView);
            imageViewProfile = itemView.findViewById(R.id.imageViewProfile);
            textViewContactName = itemView.findViewById(R.id.textViewContactName);
            textViewContactPhone = itemView.findViewById(R.id.textViewContactPhone);
            textViewContactEmail = itemView.findViewById(R.id.textViewContactEmail);
            checkBoxSelect = itemView.findViewById(R.id.checkBoxSelect);
        }
    }
}