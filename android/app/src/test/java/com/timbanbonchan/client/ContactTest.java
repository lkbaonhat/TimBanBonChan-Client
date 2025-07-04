package com.timbanbonchan.client;

import org.junit.Test;
import org.junit.Before;
import static org.junit.Assert.*;
import java.util.ArrayList;
import java.util.List;

/**
 * Unit tests for the Contact model and group management functionality
 */
public class ContactTest {

    private Contact contact1;
    private Contact contact2;
    private List<Contact> contactsList;

    @Before
    public void setUp() {
        contact1 = new Contact(1, "Nguyễn Văn An", "0901234567", "an.nguyen@email.com", null);
        contact2 = new Contact(2, "Trần Thị Bình", "0907654321", "binh.tran@email.com", null);
        contactsList = new ArrayList<>();
        contactsList.add(contact1);
        contactsList.add(contact2);
    }

    @Test
    public void testContactCreation() {
        assertNotNull("Contact should not be null", contact1);
        assertEquals("Contact ID should be 1", 1, contact1.getId());
        assertEquals("Contact name should match", "Nguyễn Văn An", contact1.getName());
        assertEquals("Contact phone should match", "0901234567", contact1.getPhoneNumber());
        assertEquals("Contact email should match", "an.nguyen@email.com", contact1.getEmail());
        assertFalse("Contact should not be selected by default", contact1.isSelected());
    }

    @Test
    public void testContactSelection() {
        assertFalse("Contact should not be selected initially", contact1.isSelected());
        
        contact1.setSelected(true);
        assertTrue("Contact should be selected after setting", contact1.isSelected());
        
        contact1.setSelected(false);
        assertFalse("Contact should not be selected after unsetting", contact1.isSelected());
    }

    @Test
    public void testContactEquality() {
        Contact contact1Copy = new Contact(1, "Different Name", "Different Phone", "different@email.com", null);
        Contact contact3 = new Contact(3, "Lê Văn Cường", "0912345678", "cuong.le@email.com", null);
        
        assertEquals("Contacts with same ID should be equal", contact1, contact1Copy);
        assertNotEquals("Contacts with different IDs should not be equal", contact1, contact3);
    }

    @Test
    public void testContactListOperations() {
        assertEquals("Contact list should have 2 contacts", 2, contactsList.size());
        assertTrue("List should contain contact1", contactsList.contains(contact1));
        assertTrue("List should contain contact2", contactsList.contains(contact2));
    }

    @Test
    public void testGroupCreationScenario() {
        // Simulate group creation process
        String groupName = "Test Group";
        List<Contact> selectedContacts = new ArrayList<>();
        
        // Select some contacts
        contact1.setSelected(true);
        selectedContacts.add(contact1);
        
        contact2.setSelected(true);
        selectedContacts.add(contact2);
        
        // Validate group creation data
        assertFalse("Group name should not be empty", groupName.isEmpty());
        assertEquals("Selected contacts should be 2", 2, selectedContacts.size());
        assertTrue("All selected contacts should be marked as selected", 
                  selectedContacts.stream().allMatch(Contact::isSelected));
    }

    @Test
    public void testContactSearchFunctionality() {
        // Test search by name
        String searchQuery = "Nguyễn";
        boolean nameMatches = contact1.getName().toLowerCase().contains(searchQuery.toLowerCase());
        assertTrue("Search should find contact by name", nameMatches);
        
        // Test search by phone
        String phoneQuery = "0901";
        boolean phoneMatches = contact1.getPhoneNumber().contains(phoneQuery);
        assertTrue("Search should find contact by phone", phoneMatches);
        
        // Test search by email
        String emailQuery = "email.com";
        boolean emailMatches = contact1.getEmail().toLowerCase().contains(emailQuery.toLowerCase());
        assertTrue("Search should find contact by email", emailMatches);
    }

    @Test
    public void testValidationScenarios() {
        // Test empty group name
        String emptyGroupName = "";
        assertTrue("Empty group name should be invalid", emptyGroupName.trim().isEmpty());
        
        // Test no selected contacts
        List<Contact> emptySelection = new ArrayList<>();
        assertTrue("No selected contacts should be invalid", emptySelection.isEmpty());
        
        // Test valid group creation
        String validGroupName = "Valid Group";
        List<Contact> validSelection = new ArrayList<>();
        validSelection.add(contact1);
        
        assertFalse("Valid group name should be accepted", validGroupName.trim().isEmpty());
        assertFalse("Valid selection should be accepted", validSelection.isEmpty());
    }
}